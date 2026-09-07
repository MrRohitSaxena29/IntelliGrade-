package com.intelligrade.repository;

import com.intelligrade.entity.EvaluationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EvaluationItemRepository extends JpaRepository<EvaluationItem, String> {
    List<EvaluationItem> findByResult_ResultId(String resultId);
    List<EvaluationItem> findByQuestionId(String questionId);
}
