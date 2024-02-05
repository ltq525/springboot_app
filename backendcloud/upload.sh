#! /bin/sh

scp backend/target/*.jar spring:spring/backendcloud/
scp botrunningsystem/target/*.jar spring:spring/backendcloud/
scp matchingsystem/target/*.jar spring:spring/backendcloud/

