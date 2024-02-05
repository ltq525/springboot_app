package com.kob.matchingsystem.service.impl.utils;

import javafx.application.Platform;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class MatchingPool extends Thread {
    private static List<Player> players = new ArrayList<>();
    private static final ReentrantLock lock = new ReentrantLock();
    // 建立http链接
    private static RestTemplate restTemplate;
    private static final String startGameUrl = "http://127.0.0.1:3000/pk/start/game/";

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        MatchingPool.restTemplate = restTemplate;
    }

    public void addPlayer(Integer userId, Integer rating, Integer botId) {
        lock.lock();
        try {
            boolean f = false;
            for(Player player : players) {
                if (player.getUserId().equals(userId)) {
                    f = true;
                    break;
                }
            }
            if (!f) players.add(new Player(userId, rating, botId, 0)); // 避免自己和自己匹配
        } finally {
            lock.unlock();
        }
    }

    public static void removePlayer(Integer userId) {
        lock.lock();
        try {
            List<Player> new_players = new ArrayList<>();
            for(Player player : players) {
                if(!player.getUserId().equals(userId)) {
                    new_players.add(player);
                }
            }
            players = new_players;

        } finally {
            lock.unlock();
        }
    }

    private void increaseWaitingTime() { // 将所有当前玩家的等待时间加1
        for (Player player : players) {
            player.setWaitingtime(player.getWaitingtime() + 1);
        }
    }

    private boolean checkMatched(Player a, Player b) {
        int ratingDelta = Math.abs(a.getRating() - b. getRating());
        int waitTime = Math.min(a.getWaitingtime(), b.getWaitingtime());
        // 每秒匹配阈值扩大10rating
        return ratingDelta <= waitTime * 10;

    }

    private void sendResult(Player a, Player b) {
        System.out.println("sendResult: " + a + " " + b);
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("a_id", a.getUserId().toString());
        data.add("a_bot_id", a.getBotId().toString());
        data.add("b_id", b.getUserId().toString());
        data.add("b_bot_id", b.getBotId().toString());
        restTemplate.postForObject(startGameUrl, data, String.class);
    }

    private void matchPlayers() {
        boolean[] used = new boolean[players.size()];
        for (int i = 0;  i < players.size(); i ++) {
            if (used[i]) continue;
            for (int j = i + 1; j < players.size(); j ++) {
                if (used[j]) continue;
                Player a = players.get(i), b = players.get(j);
                if (checkMatched(a, b)) {
                    used[i] = used[j] = true;
                    sendResult(a, b);
                    break;
                }
            }
        }

        List<Player> new_players = new ArrayList<>();
        for (int i = 0;  i < players.size(); i ++) {
            if(!used[i]) {
                new_players.add(players.get(i));
            }
        }
        players = new_players;


    }

    @Override
    public void run() {
        while(true) {
            try {
                Thread.sleep(1000);
                lock.lock();
                try {
                    increaseWaitingTime();
                    matchPlayers();
                } finally {
                    lock.unlock();
                }


            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }
}
