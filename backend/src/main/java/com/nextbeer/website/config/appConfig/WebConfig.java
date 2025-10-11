package com.nextbeer.website.config.appConfig;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // AWS Docker Volume - Upload images
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:/app/images/", "classpath:/static/images/")
                .setCachePeriod(31556926);

        // React static assets
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .setCachePeriod(31556926);

        // Favicon files with specific handling
        registry.addResourceHandler("/favicon.ico", "/favicon-*.png", "/apple-touch-icon.png")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(31556926);

        // Other static files
        registry.addResourceHandler("/manifest.json", "/robots.txt", "/sitemap.xml")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(31556926);

        // SPA FALLBACK
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);

                        // If file exists, serve it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // If it's an API request, don't fallback
                        if (resourcePath.startsWith("api/")) {
                            return null;
                        }

                        // For ALL other routes → serve index.html (React handles routing)
                        return new ClassPathResource("/static/index.html");
                    }
                });
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}