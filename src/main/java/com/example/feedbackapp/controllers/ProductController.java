package com.example.feedbackapp.controllers;

import com.example.feedbackapp.dao.FeedbackRepository;
import com.example.feedbackapp.dao.ProductRepository;
import com.example.feedbackapp.entity.Feedback;
import com.example.feedbackapp.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/products")
public class ProductController {
	private final ProductRepository productRepository;

	@Autowired
	private FeedbackRepository feedbackRepository;

	@Autowired
	public ProductController(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	@GetMapping
	public ResponseEntity<List<Product>> getAllProducts() {

		List<Product> productList = StreamSupport.stream(productRepository.findAll().spliterator(), false)
				.collect(Collectors.toList());
		return new ResponseEntity<>(productList, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Product> findProduct(@PathVariable long id) {
		Product product = productRepository.findById(id).get();
		return new ResponseEntity<>(product, HttpStatus.OK);
	}

	@PostMapping("/feedback")
	public ResponseEntity<Feedback> save(@RequestBody Feedback feedback) {
		if (!StringUtils.hasText(feedback.getContent())) {
			return ResponseEntity.ok().build();
		}
		feedbackRepository.save(feedback);
		return ResponseEntity.ok(feedback);
	}

	@GetMapping("/feedback/{id}")
	public ResponseEntity<?> find(@PathVariable int id) {
		return new ResponseEntity<>(feedbackRepository.findByProductId(id), HttpStatus.OK);
	}
}
