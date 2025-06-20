# Spring 教学项目
开发目的：以学习`Springboot`框架为主

项目地址：<https://github.com/ltq525/springboot_app>

### 2024年上线项目，服务器已挂 
<!-- ## [点击此处进入游戏](http://47.113.218.189/) -->

## 游客账号：
用户1：1  
密码：1  

用户2：2  
密码：2  

## 介绍
该项目为一个web网页小游戏  

前端:   
实现了对战、对局列表、排行榜、个人中心  
对战: 为游戏页面, 可以选择自己喜好的AI Bot进行对战  
对局列表: 可以观看游戏录像  
排行榜: 查看站内用户积分排行  
个人中心: 可以编辑AI Bot来参与游戏对战, 每个普通用户最多编辑十个bot  

后端:   
1. 基于`Json web Token(Jwt)` 实现登陆验证  
2. 基于`Mybatis plus`实现与`Mysql`数据库进行增删查改  
3. 基于`springcloud RestTemplate` 服务器内部通信实现了匹配机制与`Bot` `java`代码编译运行自走两个微服务  
4. 通过第三方`Api`接入`OAuth2`授权登陆  


## 游戏操作与规则

游戏为匹配对战游戏  

双人对战，每秒预期扩大`10`分差，当满足分差符合预期时进入匹配房间，用户初始分数为`1500` 获胜`+5` 失败`-2`    

碰到墙或蛇身体后死亡、每走三步身体变长一次  

`W` `S` `A` `D` 或 **方向键**: 表示上下左右  

## 游戏图片
![1](https://ltq525.github.io/site/picture/spring游戏1.png)   

![2](https://ltq525.github.io/site/picture/spring游戏2.png)  

## Bot编辑：  
1. 实现`java.util.function.Supplier<Integer>`接口  
2. 编写`public Integer nextMove(String input)`函数, 返回值为移动方向  
3. 每次移动前从`get()`函数中得到一个字符串输入  

    * 字符串解析：  
    `二维压一维的地图#你的X起始坐标#你的Y起始坐标#你的所有操作#\*敌方X起始坐标#敌方Y起始坐标#\*敌方的所有操作  `

    * 地图为13行14列，1表示墙0表示空地
    * 操作字符串中 0 1 2 3表示向上、右、下、左移动  
    * 起始坐标在(13, 1) 或 (1, 14)

5. 样例代码: 
``` java
package com.kob.botrunningsystem.utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Bot implements java.util.function.Supplier<Integer> {
    @Override
    public Integer get() {
        File file = new File("input.txt");
        try {
            Scanner sc = new Scanner(file);
            return nextMove(sc.next());
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    static class Cell {
        public int x, y;
        public Cell(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    public boolean check_tail_increasing(int step) { // 检查蛇长度是否增加
        return step % 2 == 1;
    }

    public List<Cell> getCells(int sx, int sy, String steps) {
        steps = steps.substring(1);
        List<Cell> res = new ArrayList<>();
        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
        int x = sx, y = sy;
        int step = 0;
        res.add(new Cell(x, y));
        for (int i = 0; i < steps.length(); i ++) {
            int d = steps.charAt(i) - '0';
            x += dx[d];
            y += dy[d];
            res.add(new Cell(x, y));
            step++;
            if (!check_tail_increasing(step)) {
                res.remove(0);
            }
        }
        return res;
    }

    public Integer nextMove(String input) {
        System.out.println(input);
        String[] s = input.split("#");
        int[][] g = new int[13][14];
        for (int i = 0, k = 0; i < 13; i ++) {
            for (int j = 0; j < 14; j ++, k ++) {
                if (s[0].charAt(k) == '1') {
                    g[i][j] = 1;
                } else {
                    g[i][j] = 0;
                }
            }
        }

        int aSx = Integer.parseInt(s[1]), aSy = Integer.parseInt(s[2]);
        int bSx = Integer.parseInt(s[4]), bSy = Integer.parseInt(s[5]);

        List<Cell> aCells = getCells(aSx, aSy, s[3]);
        List<Cell> bCells = getCells(bSx, bSy, s[6]);

        for (Cell c : aCells) g[c.x][c.y] = 1;
        for (Cell c : bCells) g[c.x][c.y] = 1;

        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
        for (int i = 0; i < 4; i ++) {
            int x = aCells.get(aCells.size() - 1).x + dx[i];
            int y = aCells.get(aCells.size() - 1).y + dy[i];
            if (x >= 0 && x < 13 && y >= 0 && y < 14 && g[x][y] == 0) {
                return i;
            }
        }
        return 0;
    }
}
```

