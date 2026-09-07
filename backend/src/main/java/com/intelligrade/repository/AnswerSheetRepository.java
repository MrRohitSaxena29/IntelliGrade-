package com.intelligrade.repository;

import com.intelligrade.entity.AnswerSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerSheetRepository extends JpaRepository<AnswerSheet, String> {
    List<AnswerSheet> findByBatchUploadId(String batchUploadId);
}
