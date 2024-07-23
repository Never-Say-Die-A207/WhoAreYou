package com.ssafy.whoareyou.facechat;

import io.livekit.server.AccessToken;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/facechat")
public class FaceChatController {
    private final FaceChatService faceChatService;

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    @GetMapping("/matching/{userId}")
    public ResponseEntity<?> createToken(@PathVariable("userId") Integer userId){

        if(userId == null)
            return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);

        AccessToken token = faceChatService.createToken(userId);
        if(token == null)
            return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);

        return new ResponseEntity<Map<String, String>> (Map.of("token", token.toJwt()), HttpStatus.OK);
    }

//    @PostMapping(value = "/webhook", consumes = "application/webhook+json")
//    public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader, @RequestBody String body) {
//        WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
//        try {
//            LivekitWebhook.WebhookEvent event = webhookReceiver.receive(body, authHeader);
//            System.out.println("LiveKit Webhook: " + event.toString());
//        } catch (Exception e) {
//            System.err.println("Error validating webhook event: " + e.getMessage());
//        }
//        return ResponseEntity.ok("ok");
//    }
}
