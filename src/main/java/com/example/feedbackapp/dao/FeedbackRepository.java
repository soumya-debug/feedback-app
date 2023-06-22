package com.example.feedbackapp.dao;

import com.example.feedbackapp.entity.Feedback;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FeedbackRepository extends CrudRepository<Feedback, Long> {
	List<Feedback> findByProductId(int productId);
}
