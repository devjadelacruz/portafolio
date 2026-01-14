package pe.devjonathan.api.ai;

import pe.devjonathan.api.ai.dto.AiPredictRequest;
import pe.devjonathan.api.ai.dto.AiPredictResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;


@Component
public class AiClient {
  private final WebClient webClient;

  public AiClient(@Value("${ai.service.base-url}") String baseUrl){
    this.webClient = WebClient.builder().baseUrl(baseUrl).build();
  }

  public AiPredictResponse predict(String titulo, String descripcion){
    return webClient.post()
      .uri("/predict")
      .bodyValue(new AiPredictRequest(titulo, descripcion))
      .retrieve()
      .bodyToMono(AiPredictResponse.class)
      .block();
  }
}
