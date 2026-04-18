package com.example.backend.service;

import com.example.backend.model.ResourceEntity;
import com.example.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {
    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) { this.repo = repo; }

    public List<ResourceEntity> findAll() { return repo.findAll(); }
    public List<ResourceEntity> findFiltered(String q, String type, Integer minCapacity, Integer maxCapacity, String location, String status) {
        return repo.findAll().stream().filter(r -> {
            if (q != null && !q.isBlank() && (r.getName() == null || !r.getName().toLowerCase().contains(q.toLowerCase()))) return false;
            if (type != null && !type.isBlank() && (r.getType() == null || !r.getType().equals(type))) return false;
            if (status != null && !status.isBlank() && (r.getStatus() == null || !r.getStatus().equals(status))) return false;
            if (location != null && !location.isBlank() && (r.getLocation() == null || !r.getLocation().equals(location))) return false;
            if (minCapacity != null && (r.getCapacity() == null || r.getCapacity() < minCapacity)) return false;
            if (maxCapacity != null && (r.getCapacity() == null || r.getCapacity() > maxCapacity)) return false;
            return true;
        }).collect(Collectors.toList());
    }
    public ResourceEntity findById(Long id) { return repo.findById(id).orElse(null); }
    public ResourceEntity create(ResourceEntity r) { return repo.save(r); }
    public ResourceEntity update(Long id, ResourceEntity r) {
        r.setId(id);
        return repo.save(r);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
