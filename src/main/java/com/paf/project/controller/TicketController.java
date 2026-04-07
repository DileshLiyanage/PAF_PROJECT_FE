package com.paf.project.controller;

import com.paf.project.dto.TicketRequest;
import com.paf.project.model.Ticket;
import com.paf.project.model.User;
import com.paf.project.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<Ticket>> getMyTickets(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ticketService.getTicketsForUser(currentUser));
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(request, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        ticketService.deleteTicket(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
