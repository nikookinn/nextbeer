package com.nextbeer.website.mapper;

import com.nextbeer.website.dto.request.CampaignRequestDto;
import com.nextbeer.website.dto.response.CampaignResponse;
import com.nextbeer.website.model.Campaign;
import org.springframework.stereotype.Component;

@Component
public class CampaignMapper {

    public Campaign toEntity(CampaignRequestDto requestDto, String imageUrl) {
        Campaign campaign = new Campaign();
        campaign.setName(requestDto.getName());
        if (requestDto.getCampaignImage() != null && !requestDto.getCampaignImage().isEmpty()) {
            campaign.setImageUrl(imageUrl);
        } else {
            campaign.setImageUrl(null);
        }
        return campaign;
    }

    public CampaignResponse toResponse(Campaign campaign) {
        return new CampaignResponse(
                campaign.getCampaignId(),
                campaign.getName(),
                campaign.getImageUrl());
    }
}
