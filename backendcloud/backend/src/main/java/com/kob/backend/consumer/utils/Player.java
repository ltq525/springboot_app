package com.kob.backend.consumer.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private Integer id;
    private Integer sx;
    private Integer sy;
    private List<Integer> steps;

    public boolean check_tail_increasing(int step) { // 检查蛇长度是否增加
        return step % 2 == 1;
    }

    public List<Cell> getCells() {
        List<Cell> res = new LinkedList<>();
        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
        int x = sx, y = sy;
        int step = 0;
        res.add(new Cell(x, y));
        for (int i : steps) {
            x += dx[i];
            y += dy[i];
            res.add(new Cell(x, y));
            step++;
            if (!check_tail_increasing(step)) {
                res.remove(0);
            }
        }
        return res;
    }

    public String getStepsString() {
        StringBuilder res = new StringBuilder();
        for (int i : steps) {
            res.append(i);
        }
        return res.toString();
    }
}
