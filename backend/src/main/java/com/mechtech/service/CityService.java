package com.mechtech.service;

import com.mechtech.dto.AreaDTO;
import com.mechtech.dto.CityDTO;
import com.mechtech.model.Area;
import com.mechtech.model.City;
import com.mechtech.repository.AreaRepository;
import com.mechtech.repository.CityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final AreaRepository areaRepository;

    public CityService(CityRepository cityRepository, AreaRepository areaRepository) {
        this.cityRepository = cityRepository;
        this.areaRepository = areaRepository;
    }

    public List<CityDTO> getAllCities() {
        // Load all active cities
        List<City> cities = cityRepository.findByIsActiveTrue();

        // Load all areas to group them in memory (avoids N+1 queries)
        List<Area> areas = areaRepository.findAll();
        Map<Long, List<Area>> areasByCityId = areas.stream()
                .collect(Collectors.groupingBy(area -> area.getCity().getId()));

        return cities.stream()
                .map(city -> {
                    List<Area> cityAreas = areasByCityId.getOrDefault(city.getId(), new ArrayList<>());
                    List<AreaDTO> areaDTOs = cityAreas.stream()
                            .map(area -> AreaDTO.builder()
                                    .id(area.getId())
                                    .name(area.getName())
                                    .pincode(area.getPincode())
                                    .build())
                            .collect(Collectors.toList());

                    return CityDTO.builder()
                            .id(city.getId())
                            .name(city.getName())
                            .state(city.getState())
                            .areas(areaDTOs)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
