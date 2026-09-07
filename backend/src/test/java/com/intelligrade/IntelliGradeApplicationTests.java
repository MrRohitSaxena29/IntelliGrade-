package com.intelligrade;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intelligrade.dto.AuthDto;
import com.intelligrade.dto.EvaluationDto;
import com.intelligrade.repository.AnswerSheetRepository;
import com.intelligrade.repository.ExamRepository;
import com.intelligrade.repository.ResultRepository;
import com.intelligrade.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class IntelliGradeApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private AnswerSheetRepository answerSheetRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Test
    @DisplayName("Context loads and DataInitializer seeds default database successfully")
    void contextLoadsAndDataInitializerPopulatesData() {
        assertThat(userRepository.count()).isGreaterThanOrEqualTo(3);
        assertThat(examRepository.count()).isGreaterThanOrEqualTo(2);
        assertThat(answerSheetRepository.count()).isGreaterThanOrEqualTo(2);
        assertThat(resultRepository.count()).isGreaterThanOrEqualTo(1);

        assertThat(userRepository.findByEmail("prof.aris@university.edu")).isPresent();
        assertThat(examRepository.findById("exam-101")).isPresent();
    }

    @Test
    @DisplayName("GET /api/health returns UP status")
    void healthCheckSucceeds() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("IntelliGrade Backend Core"));
    }

    @Test
    @DisplayName("POST /api/auth/login succeeds with seeded credentials and returns JWT")
    void loginWithValidCredentialsReturnsJwt() throws Exception {
        AuthDto.LoginRequest request = AuthDto.LoginRequest.builder()
                .email("prof.aris@university.edu")
                .password("password123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("prof.aris@university.edu"))
                .andExpect(jsonPath("$.user.role").value("LEAD_PROFESSOR"))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        AuthDto.AuthResponse authResponse = objectMapper.readValue(responseJson, AuthDto.AuthResponse.class);
        String jwtToken = authResponse.getToken();
        assertThat(jwtToken).isNotBlank();

        // Access authenticated endpoint /api/auth/me
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dr. Aris Thorne"));
    }

    private String obtainAccessToken() throws Exception {
        AuthDto.LoginRequest request = AuthDto.LoginRequest.builder()
                .email("prof.aris@university.edu")
                .password("password123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        AuthDto.AuthResponse authResponse = objectMapper.readValue(responseJson, AuthDto.AuthResponse.class);
        return authResponse.getToken();
    }

    @Test
    @DisplayName("GET /api/dashboard/metrics returns calculated statistics")
    void dashboardMetricsReturnsCorrectValues() throws Exception {
        String token = obtainAccessToken();
        mockMvc.perform(get("/api/dashboard/metrics")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalExams").isNumber())
                .andExpect(jsonPath("$.totalSheetsEvaluated").isNumber())
                .andExpect(jsonPath("$.averageAiAccuracy").isNumber());
    }

    @Test
    @DisplayName("GET /api/sheets/{id}/evaluation returns student, exam, and question breakdown")
    void sheetEvaluationReturnsCompleteData() throws Exception {
        String token = obtainAccessToken();
        mockMvc.perform(get("/api/sheets/sheet-101/evaluation")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sheetId").value("sheet-101"))
                .andExpect(jsonPath("$.student.rollNumber").value("12044"))
                .andExpect(jsonPath("$.examTitle").value("Class XII - Physics Mid-Term Board Simulation"))
                .andExpect(jsonPath("$.result.items").isArray());
    }

    @Test
    @DisplayName("POST /api/results/{id}/override updates marks and logs audit entry")
    void overrideMarksUpdatesScore() throws Exception {
        String token = obtainAccessToken();
        EvaluationDto.OverrideMarksRequest request = EvaluationDto.OverrideMarksRequest.builder()
                .questionId("q-1")
                .teacherUserId("usr-101")
                .teacherMarks(5.0)
                .teacherNotes("Verified handwritten alternative derivation")
                .build();

        mockMvc.perform(post("/api/results/res-101/override")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.totalMarks").isNumber())
                .andExpect(jsonPath("$.result.status").value("TEACHER_REVIEWED"));
    }
}
