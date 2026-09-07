package com.intelligrade.repository;

import com.intelligrade.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByInstituteId(String instituteId);
    Optional<Student> findByInstituteIdAndRollNumber(String instituteId, String rollNumber);
}
