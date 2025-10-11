package com.nextbeer.website.exception;

public class MenuNotFoundException extends RuntimeException{
    public MenuNotFoundException(String message){
        super(message);
    }
}
