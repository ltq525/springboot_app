package com.kob.backend.service.impl.user.account;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class RegisterServiceImpl implements RegisterService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Map<String, String> register(String username, String password, String confirmedPassword) {
        Map<String, String> map = new HashMap<>();
        if (username == null) {
            map.put("message", "用户名不能为空");
        } else if (password == null || confirmedPassword == null) {
            map.put("message", "密码不能为空");
        } else {
            username = username.trim();
            password = password.trim();
            confirmedPassword = confirmedPassword.trim();

            if (username.isEmpty()) {
                map.put("message", "用户名不能为空");
            } else if (username.length() > 100) {
                map.put("message", "用户名不能大于100");
            } else if (password.isEmpty() || confirmedPassword.isEmpty()) {
                map.put("message", "密码不能为空");
            } else if (password.length() > 100 || confirmedPassword.length() > 100) {
                map.put("message", "密码不能大于100");
            } else if (!password.equals(confirmedPassword)) {
                map.put("message", "两次输入的密码不一致");
            } else {
                QueryWrapper<User> queryWrapper = new QueryWrapper<>();
                queryWrapper.eq("username", username);
                List<User> users = userMapper.selectList(queryWrapper);
                if (!users.isEmpty()) {
                    map.put("message", "用户名已存在");
                    return map;
                }

                String encodePassword = passwordEncoder.encode(password);

                String[] photo = {"https://ltq525.github.io/site/logo/%E9%B3%84%E9%B1%BC.png", "https://ltq525.github.io/site/logo/%E7%8B%90%E7%8B%B8.png"};
                Random random = new Random();

                User user = new User(null, username, encodePassword, photo[random.nextInt(2)], 1500, null);
                userMapper.insert(user);
                map.put("message", "success");

            }
        }

        return map;
    }
}
