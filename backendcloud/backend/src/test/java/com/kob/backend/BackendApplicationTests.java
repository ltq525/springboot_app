package com.kob.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println(passwordEncoder.encode("pltq"));
        System.out.println(passwordEncoder.encode("pltq"));
        System.out.println(passwordEncoder.matches("pltq", "$2a$10$5E9yjbkl9TejxXbpGF1UDulcaNcH3g3g/92rfUTxLxo3BBa5XvAQC"));
    }

}
