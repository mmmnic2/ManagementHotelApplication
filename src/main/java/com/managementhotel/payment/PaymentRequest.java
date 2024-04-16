package com.managementhotel.payment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private String status;
    private String message;
    private String url;
}
