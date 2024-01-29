package com.kob.backend.service.impl.user.bot;

import com.kob.backend.mapper.BotMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import com.kob.backend.service.user.bot.UpdateService;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class UpdateServiceImpl implements UpdateService {
    @Autowired
    private BotMapper botMapper;

    @Override
    public Map<String, String> update(Map<String, String> data) {
        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authentication.getPrincipal();
        User user = loginUser.getUser();

        int bot_id = Integer.parseInt(data.get("bot_id"));

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

            Bot bot = botMapper.selectById(bot_id);

            if (bot == null)    {
                map.put("message", "Bot不存在或已删除");
            } else if (!bot.getUserId().equals(user.getId())) {
                map.put("message", "没有权限修改Bot");
            } else {
                Date now = new Date();
                Bot new_bot = new Bot(
                        bot_id,
                        user.getId(),
                        title,
                        description,
                        content,
                        bot.getCreatetime(),
                        now
                );
                botMapper.updateById(new_bot);
                map.put("message", "success");
            }

        }

        return map;
    }
}
