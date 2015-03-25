package heroes.web;

import bowser.Controller;
import bowser.template.Data;

public class HomePage extends Controller {

  private String ip;

  public HomePage(String ip) {
    this.ip = ip;
  }

  @Override
  public void init() {
    route("GET", "/").to("home.html").data(data);
  }

  private final Data data = context -> {
    context.put("ip", ip);
  };

  @Override
  protected String getJsFolder() {
    return "js/";
  }

}
