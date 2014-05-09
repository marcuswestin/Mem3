package main

import (
	"log"
	"net/http"
)

func logRequest(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.URL.Path)
		h.ServeHTTP(w, r)
	})
}

func main() {
	address := ":80"
	log.Println("Listening on", address)
	panic(http.ListenAndServe(address, logRequest(http.FileServer(http.Dir(".")))))
}
