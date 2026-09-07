package com.intelligrade.repository;

import com.intelligrade.entity.OCRPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OCRPageRepository extends JpaRepository<OCRPage, String> {
    List<OCRPage> findBySheetIdOrderByPageNumberAsc(String sheetId);
    Optional<OCRPage> findBySheetIdAndPageNumber(String sheetId, Integer pageNumber);
}
