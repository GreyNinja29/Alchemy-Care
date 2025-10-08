package com.alchemycare.userservice.repository;


import com.alchemycare.userservice.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<UserModel,Long> {

    public UserModel findUserModelByEmail(String email);

    public boolean existsUserModelsByEmail(String email);
}
