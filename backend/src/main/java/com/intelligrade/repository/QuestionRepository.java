package com.intelligrade.repository;

import com.intelligrade.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByExamIdOrderByQuestionNumberAsc(String examId);
}
