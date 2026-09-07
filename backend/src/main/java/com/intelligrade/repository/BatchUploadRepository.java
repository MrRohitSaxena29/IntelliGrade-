package com.intelligrade.repository;

import com.intelligrade.entity.BatchUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BatchUploadRepository extends JpaRepository<BatchUpload, String> {
    List<BatchUpload> findByExamIdOrderByUploadedAtDesc(String examId);
    List<BatchUpload> findAllByOrderByUploadedAtDesc();
}
