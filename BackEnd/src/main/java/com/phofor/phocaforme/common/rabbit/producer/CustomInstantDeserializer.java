package com.phofor.phocaforme.common.rabbit.producer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.Instant;

public class CustomInstantDeserializer extends JsonDeserializer<Instant> {
    @Override
    public Instant deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {
        String timestamp = p.getText(); // Get the timestamp as a string
        long seconds = Long.parseLong(timestamp.substring(0, timestamp.indexOf('.')));
        int nanos = Integer.parseInt(timestamp.substring(timestamp.indexOf('.') + 1));
        return Instant.ofEpochSecond(seconds, nanos);
    }
}