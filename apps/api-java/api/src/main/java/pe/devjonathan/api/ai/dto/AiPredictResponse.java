package pe.devjonathan.api.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiPredictResponse(
  String prioridad,
  @JsonProperty("confidence") Double confidence,
  @JsonProperty("model_version") String modelVersion
) {}
