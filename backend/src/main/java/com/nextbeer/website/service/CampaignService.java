package com.nextbeer.website.service;

import com.nextbeer.website.dto.request.CampaignRequestDto;
import com.nextbeer.website.dto.response.CampaignResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CampaignService {

    CampaignResponse saveCampaign(CampaignRequestDto requestDto);

    CampaignResponse updateCampaign(Long id, CampaignRequestDto requestDto);

    CampaignResponse getCampaignById(Long id);

    Page<CampaignResponse> getAllCampaigns(int page, int size);

    List<CampaignResponse> getAllCampaigns();

    void markCampaignAsInactive(Long id);

}
