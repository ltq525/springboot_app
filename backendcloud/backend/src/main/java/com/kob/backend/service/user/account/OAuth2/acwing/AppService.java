package com.kob.backend.service.user.account.OAuth2.acwing;

import com.alibaba.fastjson.JSONObject;

public interface AppService {
    JSONObject applyCode();
    JSONObject receiveCode(String code, String state);
}
