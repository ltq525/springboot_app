package com.kob.backend.service.impl.user.bot;

import com.kob.backend.mapper.BotMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import com.kob.backend.service.bot.AddService;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AddServiceImpl implements AddService {

    @Autowired
    private BotMapper botMapper;

    @Override
    public Map<String, String> add(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authentication.getPrincipal();
        User user = loginUser.getUser();

        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");

        Map<String, String> map = new HashMap<>();

        if (title == null || title.isEmpty()) {
            map.put("message", "标题不能为空");
        } else if (title.length() > 100) {
            map.put("message", "标题长度不能大于100");
        } else if (description != null && description.length() > 300) {
            map.put("message", "Bot描述的长度不能大于100");
        } else if (content == null || content.isEmpty()) {
            map.put("message", "代码不能为空");
        } else if (content.length() > 10000) {
            map.put("message", "代码不能超过10000");
        } else {
            if (description == null || description.isEmpty()) {
                description = "这个用户很懒，什么也没留下~";
            }
            Date now = new Date();
            Bot bot = new Bot(
                    null,
                    user.getId(),
                    title,
                    description,
                    content,
                    1500,
                    now,
                    now
            );
            botMapper.insert(bot);
            map.put("message", "success");

        }
        return map;
    }
}
