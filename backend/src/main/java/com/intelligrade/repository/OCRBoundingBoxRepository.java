package com.intelligrade.repository;

import com.intelligrade.entity.OCRBoundingBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OCRBoundingBoxRepository extends JpaRepository<OCRBoundingBox, String> {
    List<OCRBoundingBox> findByPageIdOrderByLineIndexAsc(String pageId);
    List<OCRBoundingBox> findByQuestionId(String questionId);
}
