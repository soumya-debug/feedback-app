package com.example.feedbackapp.dao;

import com.example.feedbackapp.entity.Product;
import org.springframework.data.repository.CrudRepository;

public interface ProductRepository extends CrudRepository<Product, Long> {
}
