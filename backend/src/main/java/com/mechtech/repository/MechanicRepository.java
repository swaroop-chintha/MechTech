package com.mechtech.repository;

import com.mechtech.model.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long>, MechanicRepositoryCustom {
    Optional<Mechanic> findByUserId(Long userId);
}
