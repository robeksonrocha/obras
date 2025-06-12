package com.obra.pontoeletronico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import jakarta.annotation.PostConstruct;
import java.util.Arrays;

@SpringBootApplication
public class PontoEletronicoApplication {

    @Autowired
    private Environment env;

    @PostConstruct
    public void printActiveProfiles() {
        System.out.println("Perfis ativos: " + Arrays.toString(env.getActiveProfiles()));
    }

    public static void main(String[] args) {
        SpringApplication.run(PontoEletronicoApplication.class, args);
    }
} 