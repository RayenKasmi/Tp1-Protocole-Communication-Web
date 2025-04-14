import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FormDataParserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    console.log('Request body before parsing:', request.body);
    
    if (request.body) {
      console.log('Body type:', typeof request.body);
      // Safely access properties with optional chaining
      console.log('User field type:', request.body?.user ? typeof request.body.user : 'undefined');
      console.log('Skills field type:', request.body?.skills ? typeof request.body.skills : 'undefined');
      console.log('Raw user field:', request.body?.user);
      console.log('Raw skills field:', request.body?.skills);
      
      if (request.body.user && typeof request.body.user === 'string') {
        try {
          request.body.user = JSON.parse(request.body.user);
          console.log('Parsed user:', request.body.user);
        } catch (e) {
          console.error('Failed to parse user JSON:', e);
        }
      }
      
      if (request.body.skills && typeof request.body.skills === 'string') {
        try {
          const parsedSkills = JSON.parse(request.body.skills);
          console.log('Parsed skills:', parsedSkills);
          
          if (Array.isArray(parsedSkills)) {
            request.body.skills = parsedSkills;
          } else if (typeof parsedSkills === 'object') {
            request.body.skills = [parsedSkills];
          } else {
            request.body.skills = [];
          }
          console.log('Final skills array:', request.body.skills);
        } catch (e) {
          console.error('Failed to parse skills JSON:', e);
          request.body.skills = []; 
        }
      } 
    }
    
    console.log('Request body after parsing:', request.body);
        
    return next.handle();
  }
}