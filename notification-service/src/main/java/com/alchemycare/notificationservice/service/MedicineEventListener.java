package com.alchemycare.notificationservice.service;

import com.alchemycare.notificationservice.events.EventType;
import com.alchemycare.notificationservice.events.MedicineEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class MedicineEventListener {

    @Autowired
    MedicineScheduleService medicineScheduleService;

    @KafkaListener(topics = "medicine-events",groupId = "notification-group")
    public void listen(MedicineEvent event) {

        decideEventOperation(event);

    }

    public void decideEventOperation(MedicineEvent event) {

        EventType type;

        switch (event.getEventType()) {
            case "SCHEDULED" -> {

                medicineScheduleService.scheduleNotification(event);

            }


            case "CANCELLED" -> {
                    medicineScheduleService.cancelNotification(event.getMedicineId());
            }

            default -> {
                //TO DO
            }
        }
    }



}
