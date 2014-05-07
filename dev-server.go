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
	panic(http.ListenAndServe(":8080", logRequest(http.FileServer(http.Dir(".")))))
}
