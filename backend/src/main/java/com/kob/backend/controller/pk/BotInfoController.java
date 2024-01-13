package com.kob.backend.controller.pk;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pk/")
public class BotInfoController {
    @RequestMapping("/getbotinfo/")
    public Map<String, String> getBotinfo() {
        Map<String, String> map = new HashMap<>();

        map.put("name", "alice");
        map.put("rating", "1500");
        return map;


    }
}
