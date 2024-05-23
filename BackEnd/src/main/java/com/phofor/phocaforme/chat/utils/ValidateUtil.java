package com.phofor.phocaforme.chat.utils;

import lombok.NoArgsConstructor;
import org.springframework.util.Assert;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class ValidateUtil {

    public static void checkText(String text, String message) {
        Assert.hasText(text, message);
    }
}
