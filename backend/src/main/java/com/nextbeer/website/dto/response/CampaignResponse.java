package com.nextbeer.website.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignResponse {
    private Long campaignId;

    private String name;

    private String imageUrl;
}
