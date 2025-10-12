package com.alchemycare.notificationservice.service;

import com.alchemycare.notificationservice.events.MedicineEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;


@Service
public class MedicineScheduleService {

    @Qualifier("taskScheduler")
    @Autowired
    TaskScheduler taskScheduler;

    @Autowired
    EmailService emailService;

    private final ConcurrentHashMap<Long, ScheduledFuture<?>> scheduledTasks=new ConcurrentHashMap<>();

    public void scheduleNotification(MedicineEvent event) {

        while(event.getNextDose().isBefore(LocalDateTime.now())) {
            System.out.println("Next dose time is in past , the missed medicine is :"+event.getMedicineName());

            event.setNextDose(calculateNextDose(event.getNextDose(), event.getFrequencyType(), event.getFrequencyInterval()));



        }

        long delay=Duration.between(LocalDateTime.now(),event.getNextDose()).toMillis();

        ScheduledFuture<?> future=taskScheduler.schedule(() ->
                sendRemainder(event),
                Instant.now().plusMillis(delay)
                );


        scheduledTasks.put(event.getMedicineId(),future);



    }

    public void sendRemainder(MedicineEvent event) {
        // send email
        System.out.println("Reminder: Time To take :"+event.getMedicineName());

        emailService.sendMail(event.getUserEmail(),"Medicine Remainder","Time To Take: "+event.getMedicineName());




        LocalDateTime nextDose=calculateNextDose(event.getNextDose(),event.getFrequencyType(),event.getFrequencyInterval());

        if(event.getEndTime()!=null && nextDose.isAfter(event.getEndTime())) {
            System.out.println("Medicine "+event.getMedicineName()+" is Completed!");
            return;
        }


        event.setNextDose(nextDose);

        scheduleNotification(event);

    }

    private LocalDateTime calculateNextDose(LocalDateTime current, String frequencyType, Integer frequencyInterval) {

       return switch (frequencyType) {
            case "HOURLY"-> current.plusHours(frequencyInterval);
            case "DAILY"-> current.plusDays(frequencyInterval);
            case "WEEKLY"->current.plusWeeks(frequencyInterval);
            case "MONTHLY"-> current.plusMonths(frequencyInterval);
           default -> LocalDateTime.now();

        };

    }

    public void cancelNotification(Long medicineId) {
        ScheduledFuture<?> future=scheduledTasks.remove(medicineId);

        if(future!=null) {
            future.cancel(true);
            System.out.println("Canceled Schedule for medicine id: "+medicineId);
        }

    }
}
