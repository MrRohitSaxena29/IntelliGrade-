package com.intelligrade.repository;

import com.intelligrade.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, String> {
    Optional<Result> findBySheetId(String sheetId);
    List<Result> findByExamId(String examId);
    List<Result> findByStudentId(String studentId);
}
