package com.example.backend.dataloader;

import com.example.backend.model.ResourceEntity;
import com.example.backend.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private final ResourceRepository repo;

    public DataLoader(ResourceRepository repo) { this.repo = repo; }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() == 0) {
            ResourceEntity r1 = new ResourceEntity();
            r1.setName("Lecture Theatre A"); r1.setType("Lecture Theatre"); r1.setCapacity(120); r1.setLocation("Main Building"); r1.setStatus("ACTIVE"); r1.setAvailability(List.of("Mon 09:00-12:00","Tue 13:00-16:00"));

            ResourceEntity r2 = new ResourceEntity();
            r2.setName("Projector 1"); r2.setType("Equipment"); r2.setCapacity(1); r2.setLocation("Media Room"); r2.setStatus("OUT_OF_SERVICE"); r2.setAvailability(List.of());

            repo.saveAll(List.of(r1,r2));
        }
    }
}
