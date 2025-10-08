package com.alchemycare.userservice.repository;


import com.alchemycare.userservice.model.MedicineModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepo extends JpaRepository<MedicineModel,Long> {

}
