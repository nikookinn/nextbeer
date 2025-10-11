package com.nextbeer.website.service.serviceImpl;

import com.nextbeer.website.dto.request.CampaignRequestDto;
import com.nextbeer.website.dto.response.CampaignResponse;
import com.nextbeer.website.enums.ImageDirectory;
import com.nextbeer.website.exception.CampaignNotFoundException;
import com.nextbeer.website.mapper.CampaignMapper;
import com.nextbeer.website.model.Campaign;
import com.nextbeer.website.repository.CampaignRepository;
import com.nextbeer.website.service.CampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository repository;
    private final CampaignMapper mapper;
    private final FileStorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public List<CampaignResponse> getAllCampaigns() {
        List<Campaign> campaignList = repository.findAllByIsActiveIsTrue();
        return campaignList.stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CampaignResponse saveCampaign(CampaignRequestDto requestDto) {
        String imageUrl = null;
        if (requestDto.getCampaignImage() != null && !requestDto.getCampaignImage().isEmpty()) {
            imageUrl = storageService.storeFile(requestDto.getCampaignImage(), ImageDirectory.CAMPAIGN_IMAGES.getDirectory());
        }
        Campaign campaign = mapper.toEntity(requestDto, imageUrl);
        Campaign savedCampaign = repository.save(campaign);
        log.info("new campaign successfully added to db with name : " + savedCampaign.getName());
        return mapper.toResponse(savedCampaign);
    }

    @Override
    @Transactional
    public CampaignResponse updateCampaign(Long id, CampaignRequestDto requestDto) {
        Campaign campaign = findCampaignById(id);
        String imageUrl = campaign.getImageUrl();
        if (requestDto.getCampaignImage() != null && !requestDto.getCampaignImage().isEmpty()) {
            storageService.deleteOldImage(imageUrl, ImageDirectory.CAMPAIGN_IMAGES.getDirectory());
            imageUrl = storageService.storeFile(requestDto.getCampaignImage(), ImageDirectory.CAMPAIGN_IMAGES.getDirectory());
        } else if (requestDto.isRemoveImage()) {
            storageService.deleteOldImage(imageUrl, ImageDirectory.CAMPAIGN_IMAGES.getDirectory());
            imageUrl = null;
        }

        campaign.setName(requestDto.getName());
        campaign.setImageUrl(imageUrl);
        Campaign savedCampaign = repository.save(campaign);
        log.info("campaign successfully updated with name : " + savedCampaign.getName());
        return mapper.toResponse(savedCampaign);
    }

    @Override
    @Transactional
    public void markCampaignAsInactive(Long id) {
        Campaign campaign = findCampaignById(id);
        campaign.setActive(false);
        repository.save(campaign);
        log.info("campaign successfully removed from db with name : " + campaign.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignResponse getCampaignById(Long id) {
        Campaign campaign = findCampaignById(id);
        return mapper.toResponse(campaign);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CampaignResponse> getAllCampaigns(int page, int size) {
        Page<Campaign> findAllCampaignsByPage = repository.findAllByIsActiveIsTrue(PageRequest.of(page, size));
        return findAllCampaignsByPage.map(mapper::toResponse);
    }
    @Transactional(readOnly = true)
    public Campaign findCampaignById(Long id) {
        return repository.findCampaignByCampaignIdAndIsActiveIsTrue(id)
                .orElseThrow(() -> new CampaignNotFoundException("Campaign with " + id + " is not found"));
    }
}
