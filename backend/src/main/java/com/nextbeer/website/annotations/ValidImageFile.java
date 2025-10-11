package com.nextbeer.website.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
@Constraint(validatedBy = FileTypeValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidImageFile {
    String message() default "Invalid file type. Only .jpg, .jpeg, and .png are allowed";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
