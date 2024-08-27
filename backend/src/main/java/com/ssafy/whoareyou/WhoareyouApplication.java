package com.ssafy.whoareyou;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WhoareyouApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhoareyouApplication.class, args);
	}

}
