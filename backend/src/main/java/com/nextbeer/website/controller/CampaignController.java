package com.nextbeer.website.controller;

import com.nextbeer.website.dto.request.CampaignRequestDto;
import com.nextbeer.website.dto.response.CampaignResponse;
import com.nextbeer.website.dto.response.PageResponse;
import com.nextbeer.website.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<?> getAllCampaigns(@RequestParam(defaultValue = "0") Integer page,
                                             @RequestParam(defaultValue = "10") Integer size) {
        if (page != null && size != null) {
            Page<CampaignResponse> campaignPage = campaignService.getAllCampaigns(page, size);
            PageResponse<CampaignResponse> response = new PageResponse<>(
                    campaignPage.getContent(),
                    campaignPage.getNumber(),
                    campaignPage.getSize(),
                    campaignPage.getTotalElements(),
                    campaignPage.getTotalPages(),
                    campaignPage.isFirst(),
                    campaignPage.isLast()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.ok(campaignService.getAllCampaigns());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<CampaignResponse> saveCampaign(@RequestPart("campaign") @Valid CampaignRequestDto requestDto,
                                                         @RequestPart(value = "campaignImage", required = false) MultipartFile campaignImage) {
        requestDto.setCampaignImage(campaignImage);
        return ResponseEntity.ok(campaignService.saveCampaign(requestDto));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<CampaignResponse> updateMenu(@PathVariable Long id,
                                                       @RequestPart("campaign") @Valid CampaignRequestDto requestDto,
                                                       @RequestPart(value = "campaignImage", required = false) MultipartFile campaignImage) {
        requestDto.setCampaignImage(campaignImage);
        return ResponseEntity.ok(campaignService.updateCampaign(id, requestDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") Long id) {
        campaignService.markCampaignAsInactive(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getCampaignById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }
}
