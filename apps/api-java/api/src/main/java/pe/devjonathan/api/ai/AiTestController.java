package pe.devjonathan.api.ai;

import pe.devjonathan.api.ai.dto.AiPredictResponse;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/ai")
public class AiTestController {

  private final AiClient aiClient;

  public AiTestController(AiClient aiClient) {
    this.aiClient = aiClient;
  }

  @PostMapping("/predict")
  public AiPredictResponse predict(@RequestBody TicketText req) {
    return aiClient.predict(req.titulo(), req.descripcion());
  }

  public record TicketText(String titulo, String descripcion) {}
}
