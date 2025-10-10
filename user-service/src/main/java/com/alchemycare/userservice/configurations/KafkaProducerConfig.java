package com.alchemycare.userservice.configurations;


import com.alchemycare.userservice.events.MedicineEvent;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ser.std.StringSerializer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, MedicineEvent> producerFactory() {
        Map<String,Object> config=new HashMap<>();


        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,"localhost:9092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, org.apache.kafka.common.serialization.StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, org.springframework.kafka.support.serializer.JsonSerializer.class);


        config.put(ProducerConfig.RETRIES_CONFIG,3);
        config.put(ProducerConfig.RECONNECT_BACKOFF_MS_CONFIG,1000);
        config.put(ProducerConfig.MAX_BLOCK_MS_CONFIG,1000);


        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String,MedicineEvent> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

}
