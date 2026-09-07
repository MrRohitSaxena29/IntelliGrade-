package com.intelligrade.repository;

import com.intelligrade.entity.Rubric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RubricRepository extends JpaRepository<Rubric, String> {
    List<Rubric> findByQuestionId(String questionId);
}
