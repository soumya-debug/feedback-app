package com.example.feedbackapp;

import com.example.feedbackapp.dao.ProductRepository;
import com.example.feedbackapp.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.UUID;

@SpringBootApplication
public class FeedbackAppApplication implements CommandLineRunner {

	@Autowired
	private ProductRepository productRepository;

	public static void main(String[] args) {
		SpringApplication.run(FeedbackAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		productRepository.save(getProduct());
		productRepository.save(getProduct());

		System.out.println(productRepository.findAll());
	}

	private Product getProduct() {
		Product p = new Product();
		p.setImage("https://cdn.pixabay.com/photo/2016/11/29/12/13/fence-1869401_1280.jpg");
		p.setName("NAME1");
		p.setPrice(23.4f);
		p.setQuantity(2);
		p.setUserId(UUID.randomUUID().toString());
		return p;
	}
}
